package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiCheckbox;
import be.rubus.angularprime.widget.PuiInput;
import be.rubus.angularprime.widget.PuiRadiobuttonGroup;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class RadiobuttonTest extends AbstractWidgetTest {

    // Multiple pages
    @FindBy(id = "modelValue")
    private WebElement modelValue;

    // For the default / disabled / prog selection /change demo
    @FindBy(name = "rd")
    private PuiRadiobuttonGroup puiRadiobuttonDefault;

    // For the disabled demo
    @FindBy(id = "enableBtn")
    private PuiButton enableButton;

    @FindBy(id = "disableBtn")
    private PuiButton disableButton;

    // For the prog selection
    @FindBy(id = "modelValue")
    private PuiInput modelValueInput;

    // For ng-repeat demo
    @FindBy(name = "optionExample")
    private PuiRadiobuttonGroup puiRadiobuttonRepeat;

    // For the ngShow / ngHide demo
    @FindBy(id = "chk")
    private PuiCheckbox visible;

    @Override
    protected int getWidgetIdx() {
        return 21;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("radiobutton", "puiInput on <input type='radio'>", 9);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);

        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        assertTrue(puiRadiobuttonDefault.isWidget());
        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertTrue(puiRadiobuttonDefault.hasHoverClassWhenHovered());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(1);
        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());
    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(2);

        assertEquals("Integration ng-disabled", contentArea.getExampleName());

        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertFalse(puiRadiobuttonDefault.isButtonDisabled(0));
        assertTrue(puiRadiobuttonDefault.isButtonDisabled(1));

        puiRadiobuttonDefault.clickButton(1); // The disabled one
        assertEquals("", modelValue.getText());
        assertNull(puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

        enableButton.click();

        assertFalse(puiRadiobuttonDefault.isButtonDisabled(1));

        puiRadiobuttonDefault.clickButton(1);
        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());

        disableButton.click();

        assertTrue(puiRadiobuttonDefault.isButtonDisabled(1));

        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

    }

    @Test
    @RunAsClient
    public void testProgSelected() {
        showExample(3);

        assertEquals("Setting selected radio button by code", contentArea.getExampleName());

        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());
        assertEquals("1", modelValueInput.getValue());

        modelValueInput.type("2");

        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());
    }


    @Test
    @RunAsClient
    public void testngChange() {
        showExample(4);

        assertEquals("Integration with ng-change", contentArea.getExampleName());

        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        puiRadiobuttonDefault.clickButton(0);
        window.checkForAlert();
        window.alertAccept();
    }

    @Test
    @RunAsClient
    public void testngRepeat() {
        showExample(5);

        assertEquals("Integration with ng-repeat", contentArea.getExampleName());

        assertEquals(3, puiRadiobuttonRepeat.getNumberOfButtons());

        puiRadiobuttonRepeat.clickButton(1);
        assertEquals("2", puiRadiobuttonRepeat.getSelectedValue());
        assertEquals("2", modelValue.getText());
    }

    @Test
    @RunAsClient
    public void testDirective() {
        showExample(6);

        assertEquals("puiRadiobox directive", contentArea.getExampleName());

        assertTrue(puiRadiobuttonDefault.isWidget());
        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertTrue(puiRadiobuttonDefault.hasHoverClassWhenHovered());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(1);
        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());

    }

    @Test
    @RunAsClient
    public void testngShowngHide() {
        showExample(7);

        assertEquals("puiRadiobox directive combined with ngShow", contentArea.getExampleName());

        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertTrue(visible.isChecked());
        assertTrue(puiRadiobuttonDefault.isButtonVisible(0));

        assertTrue(puiRadiobuttonDefault.isButtonVisible(1));

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

        visible.click();
        assertFalse(puiRadiobuttonDefault.isButtonVisible(0));

        assertTrue(puiRadiobuttonDefault.isButtonVisible(1));

        puiRadiobuttonDefault.clickButton(1);
        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());

        visible.click();
        assertTrue(puiRadiobuttonDefault.isButtonVisible(0));

        assertTrue(puiRadiobuttonDefault.isButtonVisible(1));

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

    }

    @Test
    @RunAsClient
    public void testElement() {
        showExample(8);

        assertEquals("Custom element", contentArea.getExampleName());
        assertEquals(VERSION_0_6, contentArea.getNewInVersionNumber());

        assertTrue(puiRadiobuttonDefault.isWidget());
        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertTrue(puiRadiobuttonDefault.hasHoverClassWhenHovered());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(1);
        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());
    }


}