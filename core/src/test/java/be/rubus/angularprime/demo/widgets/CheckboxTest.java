package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiCheckbox;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class CheckboxTest extends AbstractWidgetTest {

    // Multiple pages
    @FindBy(id = "modelValue")
    private WebElement modelValue;

    // For the default demo
    @FindBy(id = "chk1")
    private PuiCheckbox puiCheckboxDefault;

    // For the attribute checked  demo
    @FindBy(id = "chk2")
    private PuiCheckbox puiCheckboxAttributeChecked;

    // For the attribute checked  demo
    @FindBy(id = "chk3")
    private PuiCheckbox puiCheckboxDisabled;

    @FindBy(id = "enableBtn")
    private PuiButton enableButton;

    @FindBy(id = "disableBtn")
    private PuiButton disableButton;

    // For the change demo
    @FindBy(id = "chk4")
    private PuiCheckbox puiCheckboxChange;

    // For the directive demo
    @FindBy(id = "chk5")
    private PuiCheckbox puiCheckboxDirective;

    // For the show/hide demo
    @FindBy(id = "chk6")
    private PuiCheckbox puiCheckboxShowHide;

    @FindBy(id = "chk7")
    private PuiCheckbox puiCheckboxVisible;

    @Override
    protected int getWidgetIdx() {
        return 4;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("checkbox", "puiInput on <input type='checkbox'> and puiCheckbox", 8);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);

        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        assertTrue(puiCheckboxDefault.isWidget());

        assertTrue(puiCheckboxDefault.isChecked());
        assertEquals("true", modelValue.getText());

        puiCheckboxDefault.click();

        assertFalse(puiCheckboxDefault.isChecked());
        assertEquals("false", modelValue.getText());

        assertTrue(puiCheckboxDefault.hasHoverClassWhenHovered());

    }

    @Test
    @RunAsClient
    public void testAttributeChecked() {
        showExample(2);

        assertEquals("checked attribute is integrated and takes precedence over controller value (initially)",
                contentArea
                .getExampleName());

        assertTrue(puiCheckboxAttributeChecked.isWidget());

        assertTrue(puiCheckboxAttributeChecked.isChecked());
        assertEquals("true", modelValue.getText());

        puiCheckboxAttributeChecked.click();

        assertFalse(puiCheckboxAttributeChecked.isChecked());
        assertEquals("false", modelValue.getText());

    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(3);

        assertEquals("Integration with ng-disabled", contentArea.getExampleName());

        assertTrue(puiCheckboxDisabled.isWidget());

        assertFalse(puiCheckboxDisabled.isChecked());
        assertTrue(puiCheckboxDisabled.isDisabled());

        // Check that when it is disabled, we can't click on it
        assertEquals("false", modelValue.getText());
        puiCheckboxDisabled.click();
        assertFalse(puiCheckboxDisabled.isChecked());
        assertEquals("false", modelValue.getText());

        enableButton.click();

        assertFalse(puiCheckboxDisabled.isDisabled());

        puiCheckboxDisabled.click();
        assertTrue(puiCheckboxDisabled.isChecked());
        assertEquals("true", modelValue.getText());

        disableButton.click();
        assertTrue(puiCheckboxDisabled.isChecked());
        assertEquals("true", modelValue.getText());
    }

    @Test
    @RunAsClient
    public void testChange() {
        showExample(4);

        assertEquals("Integration with ng-change", contentArea.getExampleName());

        puiCheckboxChange.click();
        window.checkForAlert();
        window.alertAccept();

    }

    @Test
    @RunAsClient
    public void testDirective() {
        showExample(5);

        assertEquals("puiCheckbox directive", contentArea.getExampleName());

        assertTrue(puiCheckboxDirective.isWidget());

        assertTrue(puiCheckboxDirective.isChecked());
        assertEquals("true", modelValue.getText());

        puiCheckboxDirective.click();

        assertFalse(puiCheckboxDirective.isChecked());
        assertEquals("false", modelValue.getText());
    }

    @Test
    @RunAsClient
    public void testShowHide() {
        showExample(6);

        assertEquals("ngShow/ngHide supported with puiCheckbox directive", contentArea.getExampleName());

        assertTrue(puiCheckboxShowHide.isVisible());

        puiCheckboxVisible.click();
        assertFalse(puiCheckboxVisible.isChecked());

        assertFalse(puiCheckboxShowHide.isVisible());

        puiCheckboxVisible.click();

        assertTrue(puiCheckboxShowHide.isVisible());
    }

    @Test
    @RunAsClient
    public void testElement() {
        showExample(7);

        assertEquals("Custom element", contentArea.getExampleName());
        assertEquals(VERSION_0_6, contentArea.getNewInVersionNumber());

        assertTrue(puiCheckboxDefault.isWidget());

        assertTrue(puiCheckboxDefault.isChecked());
        assertEquals("true", modelValue.getText());

        puiCheckboxDefault.click();

        assertFalse(puiCheckboxDefault.isChecked());
        assertEquals("false", modelValue.getText());

        assertTrue(puiCheckboxDefault.hasHoverClassWhenHovered());
    }

}