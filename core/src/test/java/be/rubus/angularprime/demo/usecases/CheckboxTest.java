package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.widget.BrowserWindow;
import be.rubus.angularprime.widget.Label;
import be.rubus.angularprime.widget.PuiCheckbox;
import be.rubus.angularprime.widget.PuiInput;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class CheckboxTest extends AbstractUsecaseTest {

    // Usecase 1
    @FindBy(id = "case1")
    private PuiCheckbox puiCheckbox1;

    @FindBy(id = "case1Selection")
    private PuiInput case1Value;

    // Usecase 2
    @FindBy(id = "case2")
    private PuiCheckbox puiCheckbox2;

    // Usecase 3
    @FindBy(id = "lblcase3")
    private Label checkboxLabel;

    @FindBy(id = "case3Field")
    private PuiInput checkboxLabelField;

    // Usecase 4
    @FindBy(id = "case4")
    private PuiCheckbox puiCheckbox4;

    @FindBy(id = "case4Selection")
    private PuiInput case4Value;

    @Override
    protected String getLocation() {
        return "usecases/pui-checkbox/checkbox.html";
    }

    @Test
    @RunAsClient
    public void testUseCase1() {
        showPage();

        assertFalse(puiCheckbox1.isChecked());
        //assertEquals("black and white", case1Value.getValue());
        // FIXME Issue 44

        puiCheckbox1.click();

        assertTrue(puiCheckbox1.isChecked());
        assertEquals("colour", case1Value.getValue());

        puiCheckbox1.click();

        assertFalse(puiCheckbox1.isChecked());
        assertEquals("black and white", case1Value.getValue());

        case1Value.type("colour");
        assertTrue(puiCheckbox1.isChecked());
    }

    @Test
    @RunAsClient
    public void testUseCase2() {
        showPage();

        assertEquals("AngularPrime", puiCheckbox2.getAttribute("cust-attr"));
    }

    @Test
    @RunAsClient
    public void testUseCase3() {
        showPage();

        assertEquals("Label", checkboxLabelField.getValue());
        assertEquals(checkboxLabelField.getValue(), checkboxLabel.getText());

        checkboxLabelField.type("JUnit");
        //assertEquals("JUnit", checkboxLabel.getText());
        // FIXME Issue 45

    }

    @Test
    @RunAsClient
    public void testUseCase4() {
        showPage();

        assertFalse(puiCheckbox4.isChecked());
        //assertEquals("black and white", case1Value.getValue());
        // FIXME Issue 44

        puiCheckbox4.click();

        assertTrue(puiCheckbox4.isChecked());
        assertEquals("colour", case4Value.getValue());

        puiCheckbox4.click();

        assertFalse(puiCheckbox4.isChecked());
        assertEquals("black and white", case4Value.getValue());

        case4Value.type("colour");
        assertTrue(puiCheckbox4.isChecked());
    }

}
