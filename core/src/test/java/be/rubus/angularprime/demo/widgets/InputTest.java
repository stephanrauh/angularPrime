package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiInput;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class InputTest extends AbstractWidgetTest {

    // For the default demo
    @FindBy(id = "default")
    private PuiInput puiInputDefault;

    @FindBy(id = "defaultModel")
    private WebElement defaultModel;

    @FindBy(id = "digits")
    private PuiInput puiInputDigits;

    @FindBy(id = "digitsModel")
    private WebElement digitsModel;

    // For the disabled demo
    @FindBy(id = "disabled")
    private PuiInput puiInputDisabled;

    @FindBy(id = "modelValue")
    private WebElement modelValue;

    @FindBy(id = "enableBtn")
    private PuiButton enableButton;

    @FindBy(id = "disableBtn")
    private PuiButton disableButton;

    @Override
    protected int getWidgetIdx() {
        return 11;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiInput", "puiInput", 3);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);

        assertEquals("Default integration", contentArea.getExampleName());

        assertTrue(puiInputDefault.isWidget());
        assertFalse(puiInputDefault.isDisabled());

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

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(2);

        assertEquals("Integration with ng-disabled", contentArea.getExampleName());

        assertTrue(puiInputDisabled.isDisabled());

        // To be really sure it is disabled
        assertEquals("Change me", modelValue.getText());
        try {
            puiInputDisabled.type("JUnit");
            fail("Element isn't disabled");
        } catch (InvalidElementStateException e) {
           ; // expected behaviour
        }

        enableButton.click();

        assertFalse(puiInputDisabled.isDisabled());
        assertEquals("Change me", modelValue.getText());
        puiInputDisabled.type("JUnit");
        assertEquals("JUnit", modelValue.getText());

        disableButton.click();
        assertTrue(puiInputDisabled.isDisabled());
        try {
            puiInputDisabled.type("XX");
            fail("Element isn't disabled");
        } catch (InvalidElementStateException e) {
            ; // expected behaviour
        }

    }
}
