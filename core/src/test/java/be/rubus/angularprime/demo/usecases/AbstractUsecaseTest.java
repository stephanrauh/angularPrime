package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.demo.Deployed;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.openqa.selenium.WebDriver;

public abstract class AbstractUsecaseTest {

    @Drone
    private WebDriver driver;

    protected void showPage() {
        driver.get(Deployed.ROOT + getLocation());
    }

    protected abstract String getLocation();
}
