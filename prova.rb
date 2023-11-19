require "gtk3"
require "thread"
require "ruby-nfc"
require "net/http"
require "json"
require_relative "Rfid"


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
		end
			add(@grid)
			escenari_ini
			
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
				end
				false
			}				
			end
			
		end
		
		def escenari_querry(nom)
			clear_grid
			welcome_label = Gtk::Label.new("")
			welcome_label.set_markup("Welcome <b>#{nom}</b>")
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

		end	
		
		def uid_erronea(uid)
			clear_grid
			error_label = Gtk::Label.new("")
			error_label.set_markup("Welcome <b>#{nom}</b>")
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
			GLib::Idle.add do
				uri = URI("http://78.46.5.205:3000/students?uid=#{uid}")
				res = JSON.parse(Net::HTTP.get(uri))
				if res.key?("nombre")
					nombre = res["nombre"]
					return nombre
				else
					puts("No existeix l'estudiant") 
					return nil
				end
			end
		end
end
finestra = Window.new
finestra.show_all
finestra.rfid_ini
Gtk.main
