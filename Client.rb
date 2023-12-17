require "gtk3"
require "thread"
require "ruby-nfc"
require "net/http"
require "json"
require_relative "Rfid"
require_relative "Display"

class Window < Gtk::Window 
	def initialize
		super
		set_title("Course_Manager")
		set_size_request(700, 350)
		set_border_width(15)
		set_window_position(:center)
		signal_connect("destroy") do
			Gtk.main_quit
			@thr.kill if @thr
		end
		@display = Display.new(4, 20)
		@grid = Gtk::Grid.new
		@grid.row_spacing = 10 
		@grid.column_spacing = 10 
		@grid.row_homogeneous = false
		@grid.column_homogeneous = false
		@entry = Gtk::Entry.new  
		@entry.set_placeholder_text("Enter your querry")	
		@entry.set_size_request(300, 25)
		@logout_button = Gtk::Button.new(:label => "Logout")
		@logout_button.signal_connect("clicked") do
			escenari_ini
			start_timer
		end
    
		add(@grid)
		escenari_ini
		start_timer
			
	end
		
	def start_timer
		@timeout = GLib::Timeout.add_seconds(300) do
			puts "Timer esgotat. Tancant el programa."
			@display.timeout_disp
			Gtk.main_quit				
			false 
		end
	end

	def stop_timer
		GLib::Source.remove(@timeout) if @timeout			
		@timeout = nil
	end
		
	def escenari_ini 
		clear_grid
		set_size_request(700, 350)
		@grid.set_row_homogeneous(false)
		@grid.set_column_homogeneous(false)
		blanc1 = crear_blanc
		label = Gtk::Label.new("Please, login with your university card")
		label.set_size_request(300,80)
		label.override_background_color(0, Gdk::RGBA.new(0, 0, 1, 1))
		label.override_color(0, Gdk::RGBA.new(1, 1, 1, 1))
		@grid.attach(blanc1, 0 ,0 ,19 ,12)
		@grid.attach(label, 19 ,12 ,1 ,1)
		label.show
		blanc1.show
		@display.lectura_uid
		rfid_ini
	end
		
	def rfid_ini
		@rfid = Rfid.new
		@thr = Thread.new do
		
		uid = @rfid.read_uid
		GLib::Idle.add{
			nom = get_student(uid)
			if nom != nil
				@uid = uid
				escenari_querry(nom,uid)
			else
				uid_erronea(uid)
			end
			stop_timer
			false
		}				
		end
	end
		
	def escenari_querry(nom,uid)
		show_query(nom)
		@entry.signal_connect("activate") do
            texto = @entry.text
            clear_grid
            show_query(nom)
            Thread.new do
				send_query(texto,uid)
            end
            @entry.text = ""
            stop_timer
        end
		@display.registre(nom)
	end	
		
	def uid_erronea(uid)
		clear_grid
		error_label = Gtk::Label.new("")
		error_label.set_markup("La uid: <b>#{uid}</b> no es troba a la base de dades")
		blanc1 = crear_blanc
		blanc2 = crear_blanc
		@grid.attach(error_label, 0, 0, 1, 1)
		@grid.attach(blanc1, 1, 0, 22, 1)
		@grid.attach(@logout_button, 23, 0, 1, 1)
		error_label.show
		@logout_button.show
		blanc1.show
		@display.error_usuari
	end
		
	def crear_blanc
		blanc = Gtk::Label.new("")
		blanc.set_size_request(25,25)
		return blanc
	end
	
	def clear_grid
		@grid.each { |child| @grid.remove(child) }
		@grid.show_all
	end
		
	def get_student(uid)
		
		begin
			uri = URI("http://169.254.209.172:3000/students?uid=#{uid}")
			res = JSON.parse(Net::HTTP.get(uri))
			if res.first.key?("name")
				@nombre = res.first["name"]
				return res.first["name"]
			else
				puts("No existeix l'estudiant") 
				return nil
			end
		end
	end
	
	def send_query(query,uid)
	
		if query.include? '?'
			uri = URI("http://169.254.209.172:3000/#{query}&uid=#{uid}")
		else
			uri = URI("http://169.254.209.172:3000/#{query}?uid=#{uid}")
		end
		begin
			res = JSON.parse(Net::HTTP.get(uri))
			if  res.is_a?(Hash) && res.key?('error')
				 puts "Error: #{res['error']}"
			else
				print_taula(res, query)
			end
		rescue StandardError => e
			puts "Error occurred while processing the query: #{e.message}"
			@display.error_querry
		end
	end
	
	
	def print_taula(data, query)
		index = query.index('?')
		if index
			titulo = query[0...index] 
		else
			titulo = query # Si no hay interrogante, palabra2 es igual a palabra
		end
		headers = data.first.keys
		num_rows = data.length
		num_cols = headers.length
		
		label = Gtk::Label.new("<b>#{titulo.upcase}</b>")
		label.use_markup = true
		label.set_hexpand(true)
		@grid.attach(label, 2, 4, 3, 1)
		label.show

		if num_rows > 13

			headers.each_with_index do |key, j|
				next if key == 'uid'
				label = Gtk::Label.new("<b>#{key.capitalize}</b>")
				label.use_markup = true
				label.set_hexpand(true)
				label.override_background_color(:normal, Gdk::RGBA.new(1.2, 1.2, 1.2, 1.0)) 
				if(num_cols == 4)
					@grid.attach(label, j-1, 5, 1, 1)
				else
					@grid.attach(label, j, 5, 1, 1)
				end
				label.show
			end	
			headers.each_with_index do |key, j|
				next if key == 'uid'
				label = Gtk::Label.new("<b>#{key.capitalize}</b>")
				label.use_markup = true
				label.set_hexpand(true)
				label.override_background_color(:normal, Gdk::RGBA.new(1.2, 1.2, 1.2, 1.0))
				if(num_cols == 4)
					@grid.attach(label, j+num_cols, 5, 1, 1) 
				else
					@grid.attach(label, j+num_cols+2, 5, 1, 1)
				end
				label.show
			end
			data_first_half = data[0..12] 
			data_second_half = data[13..-1] 
			data_first_half.each_with_index do |row_data, i|
				row_data.each_with_index do |(key, value), j|
					next if key == 'uid'
					label = Gtk::Label.new(value.to_s)
					if (i + 1).even?
						label.override_background_color(:normal, Gdk::RGBA.new(0.95, 0.95, 0.95, 1.0))
					else
						label.override_background_color(:normal, Gdk::RGBA.new(1.05, 1.05, 1.05, 1.0))
					end
					if(num_cols == 4)
						@grid.attach(label, j-1, i + 6, 1, 1) 
					else
						@grid.attach(label, j, i + 6, 1, 1)
					end
					label.show
				end
			end

			data_second_half.each_with_index do |row_data, i|
				row_data.each_with_index do |(key, value), j|
					next if key == 'uid'
					label = Gtk::Label.new(value.to_s)
					if (i + 1).even?
						label.override_background_color(:normal, Gdk::RGBA.new(0.95, 0.95, 0.95, 1.0))
					else
						label.override_background_color(:normal, Gdk::RGBA.new(1.05, 1.05, 1.05, 1.0))
					end
					if(num_cols == 4)
						@grid.attach(label, j+num_cols, i + 6, 1, 1) 
					else
						@grid.attach(label, j+num_cols+2, i + 6, 1, 1)
					end
					label.show
				end
			end
		else
			headers.each_with_index do |key, j|
				next if key == 'uid'
				label = Gtk::Label.new("<b>#{key.capitalize}</b>")
				label.use_markup = true
				label.set_hexpand(true)
				label.override_background_color(:normal, Gdk::RGBA.new(1.2, 1.2, 1.2, 1.0))
				@grid.attach(label, j+2, 5, 1, 1)
				label.show
			end
			data.each_with_index do |row_data, i|
				row_data.each_with_index do |(key, value), j|
					next if key == 'uid'
					label = Gtk::Label.new(value.to_s)
					if (i + 1).even?
						label.override_background_color(:normal, Gdk::RGBA.new(0.95, 0.95, 0.95, 1.0))
					else
						label.override_background_color(:normal, Gdk::RGBA.new(1.05, 1.05, 1.05, 1.0))
					end
					@grid.attach(label, j+2, i + 6, 1, 1)
					label.show
				end
			end
		end
	end
	
	def show_query(nom)
		start_timer
		clear_grid
		welcome_label1 = Gtk::Label.new("")
		welcome_label1.set_markup("Benvingut")
		welcome_label2 = Gtk::Label.new("")	
		welcome_label2.set_markup("<b>#{nom}</b>")
		blanc1 = crear_blanc
		blanc2 = crear_blanc
		@grid.attach(welcome_label1, 0, 0, 1, 1)
		@grid.attach(welcome_label2, 1, 0, 1, 1)
		@grid.attach(blanc1, 2, 0, 5, 1)
		@grid.attach(@logout_button, 7, 0, 1, 1)
		@grid.attach(blanc2, 0, 1, 1, 10)
		@grid.attach(@entry, 0, 2, 8, 1)		
		welcome_label1.show
		welcome_label2.show
		@logout_button.show
		@entry.set_hexpand(true)
		@entry.show
		blanc1.show
		blanc2.show
	end
end
finestra = Window.new
finestra.show_all
finestra.rfid_ini
Gtk.main
