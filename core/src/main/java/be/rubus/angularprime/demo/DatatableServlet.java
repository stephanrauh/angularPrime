package be.rubus.angularprime.demo;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

public class DatatableServlet extends HttpServlet {

    private static final String[] colors;

    private static final String[] brands;

    static {
        colors = new String[10];
        colors[0] = "Black";
        colors[1] = "White";
        colors[2] = "Green";
        colors[3] = "Red";
        colors[4] = "Blue";
        colors[5] = "Orange";
        colors[6] = "Silver";
        colors[7] = "Yellow";
        colors[8] = "Brown";
        colors[9] = "Maroon";

        brands = new String[10];
        brands[0] = "Mercedes";
        brands[1] = "BMW";
        brands[2] = "Volvo";
        brands[3] = "Audi";
        brands[4] = "Renault";
        brands[5] = "Opel";
        brands[6] = "Volkswagen";
        brands[7] = "Chrysler";
        brands[8] = "Ferrari";
        brands[9] = "Ford";
    }

    private List<Car> cars;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        String[] parameters = request.getPathInfo().substring(1).split("/");
        int first = Integer.valueOf(parameters[0]);
        String sortField = null;
        String order = null;

        if (parameters.length == 3) {
            sortField = parameters[1];
            order = parameters[2];
        }

        if(sortField != null) {
            Collections.sort(cars, new LazySorter(sortField, Integer.valueOf(order)));
        }

        List<Car> result = cars.subList(first, (first + 5));

        StringBuilder json = new StringBuilder();
        json.append('[');
        for (Car car: result) {
            if (json.length() > 1) {
                json.append(',');
            }
            json.append(car.toString());
        }
        json.append(']');

        response.getOutputStream().print(json.toString());

    }

    @Override
    public void init() throws ServletException {
        super.init();

        cars = new ArrayList<Car>();
        for (int i = 0; i < 200; i++) {
            cars.add(new Car(getRandomVin(), getRandomBrand(), getRandomYear(), getRandomColor()));
        }

    }

    private String getRandomVin() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private int getRandomYear() {
        return (int) (Math.random() * 50 + 1960);
    }

    private String getRandomColor() {
        return colors[(int) (Math.random() * 10)];
    }

    private String getRandomBrand() {
        return brands[(int) (Math.random() * 10)];
    }

    private static class LazySorter implements Comparator<Car> {

        private String sortField;

        private int sortOrder;

        public LazySorter(String sortField, int sortOrder) {
            this.sortField = sortField;
            this.sortOrder = sortOrder;
        }

        public int compare(Car car1, Car car2) {
            try {
                Object value1 = Car.class.getField(this.sortField).get(car1);
                Object value2 = Car.class.getField(this.sortField).get(car2);

                int value = ((Comparable)value1).compareTo(value2);

                return sortOrder * value;
            }
            catch(Exception e) {
                e.printStackTrace();
                throw new RuntimeException();
            }
        }
    }
}
