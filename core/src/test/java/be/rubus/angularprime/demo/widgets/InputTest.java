package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.ContentArea;
import be.rubus.angularprime.widget.PuiInput;
import be.rubus.angularprime.widget.WidgetSelection;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(Arquillian.class)
public class InputTest  {

    @Drone
    private WebDriver driver;

    @FindBy(id="widgetList")
    private WidgetSelection widgetSelection;

    @FindBy(id="content")
    private ContentArea contentArea;

    // For the default demo
    @FindBy(id="default")
    private PuiInput puiInputDefault;

    @FindBy(id="defaultModel")
    private WebElement defaultModel;

    @FindBy(id="digits")
    private PuiInput puiInputDigits;

    @FindBy(id="digitsModel")
    private WebElement digitsModel;

    @Test
    @RunAsClient
    public void testOverview() {
        driver.get(Deployed.ROOT);
        assertEquals("puiInputDefault", widgetSelection.getWidgetName(11));
        widgetSelection.selectWidget(11);
        assertEquals("puiInputDefault", contentArea.getName());

        assertEquals(3, contentArea.getSubpagesCount());
    }

    @Test
    @RunAsClient
    public void testDefault() {
        driver.get(Deployed.ROOT);
        widgetSelection.selectWidget(11);
        contentArea.gotoExample(1);

        assertTrue(puiInputDefault.isWidget());
        assertTrue(puiInputDefault.hasHoverClassWhenHovered());

        assertEquals("Change me", defaultModel.getText());
        puiInputDefault.type("JUnit");
        assertEquals("JUnit", defaultModel.getText());


        assertTrue(puiInputDigits.isWidget());
        assertTrue(puiInputDigits.hasHoverClassWhenHovered());

        assertEquals("123", digitsModel.getText());
        puiInputDigits.type("321");
        assertEquals("321", digitsModel.getText());
    }

}
