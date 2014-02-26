package be.rubus.angularprime.demo.widgets;

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

    @FindBy(id = "defaultModel")
    private WebElement defaultModel;

    // For the default demo
    @FindBy(id = "default")
    private PuiPassword puiPasswordDefault;

    @FindBy(id = "noStrength")
    private PuiPassword puiPasswordNoStrength;

    // Custom element
    @FindBy(id = "elm")
    private PuiPassword puiPasswordElement;

    @Override
    protected int getWidgetIdx() {
        return 18;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("password", "puiInput on <input type='password'>", 3);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);

        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

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
        window.waitForScreenUpdate(500);

        assertFalse(puiPasswordDefault.isPanelVisible());

    }

    @Test
    @RunAsClient
    public void testElement() {
        showExample(2);

        assertEquals("Custom element", contentArea.getExampleName());
        assertEquals(VERSION_0_6, contentArea.getNewInVersionNumber());

        assertTrue(puiPasswordElement.isWidget());
        assertTrue(puiPasswordElement.hasHoverClassWhenHovered());

        assertTrue(puiPasswordElement.hasPasswordPanel());
        assertFalse(puiPasswordElement.isPanelPopupType());

        assertFalse(puiPasswordElement.isPanelVisible());
        puiPasswordElement.click();
        assertTrue(puiPasswordElement.isPanelVisible());
        assertEquals("My text", puiPasswordElement.getPanelText());

    }

}
