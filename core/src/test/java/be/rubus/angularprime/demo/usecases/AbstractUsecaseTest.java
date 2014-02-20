package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.BrowserWindow;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;

public abstract class AbstractUsecaseTest {

    @Drone
    protected WebDriver driver;

    @FindBy(tagName = "body")
    protected BrowserWindow window;

    protected void showPage() {
        driver.get(Deployed.ROOT + getLocation());
    }

    protected abstract String getLocation();
}
