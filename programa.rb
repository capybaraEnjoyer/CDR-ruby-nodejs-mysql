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
		@entry.signal_connect("activate") do
            texto = @entry.text
            send_query(uid, texto)
            @entry.text = ""
            stop_timer
        end
    
		add(@grid)
		escenari_ini
		start_timer
			
	end
		
	def start_timer
		@timeout = GLib::Timeout.add_seconds(60) do
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
				escenari_querry(nom)
			else
				uid_erronea(uid)
			end
			stop_timer
			false
		}				
		end
	end
		
	def escenari_querry(nom)
		start_timer
		clear_grid
		welcome_label = Gtk::Label.new("")
		welcome_label.set_markup("Benvingut <b>#{nom}</b>")
		blanc1 = crear_blanc
		blanc2 = crear_blanc
		@grid.attach(welcome_label, 0, 0, 1, 1)
		@grid.attach(blanc1, 1, 0, 48, 1)
		@grid.attach(@logout_button, 49, 0, 1, 1)
		@grid.attach(blanc2, 0, 1, 1, 10)
		@grid.attach(@entry, 0, 6, 50, 1)		
		welcome_label.show
		@logout_button.show
		@entry.show
		blanc1.show
		blanc2.show
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
		nombre = nil
		begin
			uri = URI("http://169.254.209.172:3000/students?uid=#{uid}")
			res = Net::HTTP.get_response(uri)
			if res.is_a?(Net::HTTPSuccess)
				data = JSON.parse(res.body)
				if data.key?("nombre")
					return data["nombre"]
				else
					puts("No existeix l'estudiant") 
					return nil
				end
			else
				puts("Error en la solicitud HTTP: #{res.code}")
				return nil
			end
		rescue StandardError => e
			puts("Error en la solicitud HTTP: #{e.message}")
			return nil
		end
	end
	
	def send_query(uid, query)
		GLib::Idle.add do
			begin
				if query.include? '?'
					uri = URI("http://90.167.222.44:3000/#{query}&uid=#{uid}")
				else
					uri = URI("http://90.167.222.44:3000/#{query}?uid=#{uid}")
				end
				res = JSON.parse(Net::HTTP.get(uri))
			rescue StandardError => e
				puts "Error al realitzar la solicitud: #{e.message}"
				@display.error_querry
			end
		end
	end
end
finestra = Window.new
finestra.show_all
finestra.rfid_ini
Gtk.main
