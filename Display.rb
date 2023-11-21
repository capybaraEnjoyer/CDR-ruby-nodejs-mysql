
require "i2c/drivers/ss1602"
require "gtk3"

class Display
    def initialize(filas,columnas)
	@fil = filas
	@col = columnas		
	@display = I2C::Drivers::SS1602::Display.new("/dev/i2c-1", 0x27)
    end
	
    def lectura_uid
    
	@display.clear()
	@display.text("Please, login with", 1)
	@display.text("your university card", 2)
    end
    
    def registre(usuari)
    
	@display.clear()
	@display.text("Welcome", 1)
        @display.text(usuari, 2)
    end
    
    def error_usuari(uid)
        
	@display.clear()
	@display.text("La uid: <b>#{uid}</b>", 1)
	@display.text("no es troba a la base de dades", 2)
        
    end
    
    def error_querry
	@display.clear()
	@display.text("Error al realitzar la solicitud", 1)
    end
    
    def timeout
	@display.clear()
	@display.text("Timer esgotat.", 1)
	@display.text("Tancant el programa.",2)
    end
end
