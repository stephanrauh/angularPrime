package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.widget.PuiRadiobuttonGroup;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(Arquillian.class)
public class RadiobuttonTest extends AbstractUsecaseTest {

    @FindBy(id = "modelValue")
    private WebElement modelValue;

    // case 1
    @FindBy(name = "rd")
    private PuiRadiobuttonGroup puiRadiobuttonDefault;

    @Override
    protected String getLocation() {
        return "usecases/pui-radiobutton/radiobutton.html";
    }

    @Test
    @RunAsClient
    public void testUseCase1() {
        showPage();

        assertTrue(puiRadiobuttonDefault.isWidget());
        assertEquals(2, puiRadiobuttonDefault.getNumberOfButtons());

        assertEquals("2", modelValue.getText());
        assertEquals("2", puiRadiobuttonDefault.getSelectedValue());

        puiRadiobuttonDefault.clickButton(0);
        assertEquals("1", modelValue.getText());
        assertEquals("1", puiRadiobuttonDefault.getSelectedValue());
    }

}
