package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.BrowserWindow;
import be.rubus.angularprime.widget.ContentArea;
import be.rubus.angularprime.widget.WidgetSelection;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.junit.Ignore;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.assertEquals;

@Ignore
public abstract class AbstractWidgetTest {

    @Drone
    protected WebDriver driver;

    @FindBy(id = "widgetList")
    protected WidgetSelection widgetSelection;

    @FindBy(id = "content")
    protected ContentArea contentArea;

    @FindBy(tagName = "body")
    protected BrowserWindow window;


    protected final void showExample(int exampleIdx) {
        driver.get(Deployed.ROOT);
        widgetSelection.selectWidget(getWidgetIdx());
        contentArea.gotoExample(exampleIdx);
    }

    protected final void testWidgetOverviewPage(String widgetName, String title, int subPageCount) {
        driver.get(Deployed.ROOT);
        assertEquals(widgetName, widgetSelection.getWidgetName(getWidgetIdx()));
        widgetSelection.selectWidget(getWidgetIdx());
        assertEquals(title, contentArea.getName());

        assertEquals(subPageCount, contentArea.getSubpagesCount());

    }

    protected abstract int getWidgetIdx();
}
