package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.BrowserWindow;
import be.rubus.angularprime.widget.PuiPassword;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class PasswordTest extends AbstractWidgetTest {


    // For the default demo
    @FindBy(id = "default")
    private PuiPassword puiPasswordDefault;

    @FindBy(id = "defaultModel")
    private WebElement defaultModel;

    @FindBy(id = "noStrength")
    private PuiPassword puiPasswordNoStrength;

    @FindBy(tagName = "body")
    private BrowserWindow window;

    @Test
    @RunAsClient
    public void testOverview() {
        driver.get(Deployed.ROOT);
        assertEquals("password", widgetSelection.getWidgetName(18));
        widgetSelection.selectWidget(18);
        assertEquals("puiInput on <input type='password'>", contentArea.getName());

        assertEquals(2, contentArea.getSubpagesCount());
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(18, 1);

        assertEquals("Default integration", contentArea.getExampleName());

        assertTrue(puiPasswordDefault.isWidget());
        assertTrue(puiPasswordDefault.hasHoverClassWhenHovered());

        assertTrue(puiPasswordDefault.hasPasswordPanel());
        assertTrue(puiPasswordDefault.isPanelPopupType());

        assertFalse(puiPasswordDefault.isPanelVisible());
        puiPasswordDefault.click();
        assertTrue(puiPasswordDefault.isPanelVisible());

        puiPasswordDefault.type("JUnit");
        assertEquals("JUnit", defaultModel.getText());


        assertTrue(puiPasswordNoStrength.isWidget());

        assertTrue(puiPasswordNoStrength.hasHoverClassWhenHovered());

        assertFalse(puiPasswordNoStrength.hasPasswordPanel());

        // Blur occured in default field and thus panel should be hidden
        puiPasswordNoStrength.click();
        window.waitForScreenUpdate(200);

        assertFalse(puiPasswordDefault.isPanelVisible());

    }

}
