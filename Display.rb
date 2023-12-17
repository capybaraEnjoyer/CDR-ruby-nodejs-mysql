require "i2c/drivers/lcd"
require "gtk3"

class Display
    def initialize(filas,columnas)
	@fil = filas
	@col = columnas		
	@display = I2C::Drivers::LCD::Display.new("/dev/i2c-1", 0x27)
    end
	
    def lectura_uid
    
	@display.clear()
	@display.text("Please, login with", 0)
	@display.text("your university card", 2)
    end
    
    def registre(usuari)
    
	@display.clear()
	@display.text("Welcome", 0)
        @display.text(usuari, 2)
    end
    
    def error_usuari(uid)
        
	@display.clear()
	@display.text("La uid: #{uid}", 0)
	@display.text("no es troba a la", 1)
	@display.text("base de dades", 2)
        
    end
    
    def error_querry
	@display.clear()
	@display.text("Error al realitzar", 0)
	@display.text("la solicitud", 1)
    end
    
    def timeout
	@display.clear()
	@display.text("Timer esgotat.", 0)
	@display.text("Tancant el programa.",1)
    end
end

