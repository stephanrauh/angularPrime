package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.KeyboardEvents;
import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiInput;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.awt.*;
import java.awt.event.KeyEvent;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

@RunWith(Arquillian.class)
public class InputTest {

    @Drone
    private WebDriver driver;

    @FindBy(id = "case1")
    private PuiInput puiInput1;

    // UseCase 2
    @FindBy(id = "case2")
    private PuiInput puiInput2;

    @FindBy(id = "ctrlValue2")
    private WebElement controllerValue2;

    // UseCase 3
    @FindBy(id = "case3")
    private PuiInput puiInput3;

    @FindBy(id = "ctrlValue3")
    private WebElement controllerValue3;

    // UseCase 4
    @FindBy(id = "case4")
    private PuiInput puiInput4;

    // UseCase 5
    @FindBy(id = "case5")
    private PuiInput puiInput5;

    @FindBy(id = "ctrlValue5")
    private WebElement controllerValue5;

    @FindBy(id = "showBtn")
    private PuiButton showButton;

    @FindBy(id = "hideBtn")
    private PuiButton hideButton;

    // UseCase 6
    @FindBy(id = "case6")
    private PuiInput puiInput6;

    @Test
    @RunAsClient
    public void testUseCase1() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertTrue(puiInput1.isAngularJSInvalid());
        assertFalse(puiInput1.isAngularJSValid());

        puiInput1.type("test");

        assertFalse(puiInput1.isAngularJSInvalid());
        assertTrue(puiInput1.isAngularJSValid());
    }

    @Test
    @RunAsClient
    public void testUseCase2() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertTrue(puiInput2.isWidget());
        assertTrue(puiInput2.hasHoverClassWhenHovered());

        if (!puiInput2.doesBrowserSupportNumericInputTypes()) {
            // No point in testing the rest
            return;
        }
        puiInput2.sendUpArrowFromKeyboard();
        assertEquals("5", controllerValue2.getText());

        puiInput2.sendUpArrowFromKeyboard();
        assertEquals("6", controllerValue2.getText());

        puiInput2.sendDownArrowFromKeyboard();
        assertEquals("5", controllerValue2.getText());
        puiInput2.sendDownArrowFromKeyboard();
        assertEquals("5", controllerValue2.getText());

        puiInput2.type("19");
        assertEquals("19", controllerValue2.getText());

        puiInput2.sendUpArrowFromKeyboard();
        assertEquals("20", controllerValue2.getText());

        puiInput2.sendUpArrowFromKeyboard();
        assertEquals("20", controllerValue2.getText());

    }

    @Test
    @RunAsClient
    public void testUseCase3() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertTrue(puiInput3.isWidget());
        assertTrue(puiInput3.hasHoverClassWhenHovered());

        if (!puiInput3.doesBrowserSupportColorInputTypes()) {
            // No point in testing the rest
            return;
        }

        puiInput3.click();

        try {
            KeyboardEvents
                    .performKeyStrokes(KeyEvent.VK_UP, KeyEvent.VK_UP, KeyEvent.VK_UP, KeyEvent.VK_UP,
                            KeyEvent.VK_UP, KeyEvent.VK_SPACE, KeyEvent.VK_ENTER);

        } catch (AWTException e) {
            e.printStackTrace();
            fail(e.getMessage());
        }

        assertEquals("#ff8080", controllerValue3.getText());

    }

    @Test
    @RunAsClient
    public void testUseCase4() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertFalse(puiInput4.isWidget());
    }

    @Test
    @RunAsClient
    public void testUseCase5() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertTrue(puiInput5.isWidget());
        assertTrue(puiInput5.isVisible());

        puiInput5.type("JUnit");
        assertEquals("JUnit", controllerValue5.getText());

        hideButton.click();
        assertFalse(puiInput5.isVisible());

        try {
            puiInput5.type("Not possible");
            fail("It should not possible to type in hidden fields");
        } catch (InvalidElementStateException e) {
            ; // Expected behaviour
        }

        showButton.click();
        assertTrue(puiInput5.isVisible());

        puiInput5.type("All ok");
        assertEquals("All ok", controllerValue5.getText());

    }

    @Test
    @RunAsClient
    public void testUseCase6() {
        driver.get(Deployed.ROOT + "usecases/pui-input/input.html");

        assertTrue(puiInput6.isWidget());
    }
}

