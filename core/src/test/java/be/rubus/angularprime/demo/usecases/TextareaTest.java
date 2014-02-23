package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiTextarea;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class TextareaTest extends AbstractUsecaseTest {

    @FindBy(id = "case1")
    private PuiTextarea puiTextarea1;

    // UseCase 2
    @FindBy(id = "case2")
    private PuiTextarea puiTextarea2;

    @FindBy(id = "ctrlValue2")
    private WebElement controllerValue2;


    @FindBy(id = "showBtn")
    private PuiButton showButton;

    @FindBy(id = "hideBtn")
    private PuiButton hideButton;

    // UseCase 3
    @FindBy(id = "case3")
    private PuiTextarea puiTextarea3;


    @Override
    protected String getLocation() {
        return "usecases/pui-textarea/textarea.html";
    }

    @Test
    @RunAsClient
    public void testUseCase1() {
        showPage();

        assertTrue(puiTextarea1.isWidget());
        assertTrue(puiTextarea1.isAngularJSInvalid());
        assertFalse(puiTextarea1.isAngularJSValid());

        puiTextarea1.type("t");

        assertFalse(puiTextarea1.isAngularJSInvalid());
        assertTrue(puiTextarea1.isAngularJSValid());
    }

    @Test
    @RunAsClient
    public void testUseCase2() {
        showPage();

        assertTrue(puiTextarea2.isWidget());
        assertTrue(puiTextarea2.isVisible());

        puiTextarea2.type("JUnit");
        assertEquals("JUnit", controllerValue2.getText());

        hideButton.click();
        assertFalse(puiTextarea2.isVisible());

        try {
            puiTextarea2.type("Not possible");
            fail("It should not possible to type in hidden fields");
        } catch (InvalidElementStateException e) {
            ; // Expected behaviour
        }

        showButton.click();
        assertTrue(puiTextarea2.isVisible());

        puiTextarea2.type("All ok");
        assertEquals("All ok", controllerValue2.getText());

    }

    @Test
    @RunAsClient
    public void testUseCase3() {
        showPage();

        assertTrue(puiTextarea3.isWidget());
    }
}

