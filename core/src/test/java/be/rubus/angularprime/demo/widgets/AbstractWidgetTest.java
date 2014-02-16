package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.ContentArea;
import be.rubus.angularprime.widget.WidgetSelection;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;

public class AbstractWidgetTest {
    @Drone
    protected WebDriver driver;

    @FindBy(id = "widgetList")
    protected WidgetSelection widgetSelection;

    @FindBy(id = "content")
    protected ContentArea contentArea;

    protected void showExample(int widgetIdx, int exampleIdx) {
        driver.get(Deployed.ROOT);
        widgetSelection.selectWidget(widgetIdx);
        contentArea.gotoExample(exampleIdx);
    }
}
