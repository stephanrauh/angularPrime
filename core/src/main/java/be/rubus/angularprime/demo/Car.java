package be.rubus.angularprime.demo;

public class Car {

    public String vin;
    public String brand;
    public int year;
    public String color;

    public Car() {
    }

    public Car(String vin, String brand, int year, String color) {
        this.vin = vin;
        this.brand = brand;
        this.year = year;
        this.color = color;
    }

    public String getVin() {
        return vin;
    }
    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getBrand() {
        return brand;
    }
    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 97 * hash + (this.vin != null ? this.vin.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Car other = (Car) obj;
        if ((this.vin == null) ? (other.vin != null) : !this.vin.equals(other.vin)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("{\"brand\":\"").append(brand).append('"');
        sb.append(", \"vin\":\"").append(vin).append('\"');
        sb.append(", \"year\":").append(year);
        sb.append(", \"color\":\"").append(color).append("\"}");
        return sb.toString();
    }
}
