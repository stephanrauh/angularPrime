package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiPassword;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class PasswordTest extends AbstractUsecaseTest {

    // Use case 1
    @FindBy(id = "case1")
    private PuiPassword puiPassword1;

    // Use case 2
    @FindBy(id = "case2")
    private PuiPassword puiPassword2;

    // Use case 3
    @FindBy(id = "case3")
    private PuiPassword puiPassword3;

    // Use case 4
    @FindBy(id = "case4")
    private PuiPassword puiPassword4;

    @FindBy(id = "enableBtn")
    private PuiButton enableButton;

    @FindBy(id = "disableBtn")
    private PuiButton disableButton;

    // Use case 5
    @FindBy(id = "case5")
    private PuiPassword puiPassword5;

    @FindBy(id = "showBtn")
    private PuiButton showButton;

    @FindBy(id = "hideBtn")
    private PuiButton hideButton;

    @Override
    protected String getLocation() {
        return "usecases/pui-password/password.html";
    }


    @Test
    @RunAsClient
    public void testUseCase1() {
        showPage();

        assertTrue(puiPassword1.isWidget());
        assertTrue(puiPassword1.hasPasswordPanel());

        assertFalse(puiPassword1.isPanelPopupType());

        assertFalse(puiPassword1.isPanelVisible());

        puiPassword1.click();
        assertTrue(puiPassword1.isPanelVisible());

        puiPassword1.blur();

        window.waitForScreenUpdate(800);
        assertFalse(puiPassword1.isPanelVisible());
    }


    @Test
    @RunAsClient
    public void testUseCase2() {
        showPage();

        assertTrue(puiPassword2.isWidget());
        assertTrue(puiPassword2.hasPasswordPanel());

        puiPassword2.click();
        assertTrue(puiPassword2.isPanelVisible());

        assertEquals("label", puiPassword2.getPanelText());
        assertEquals(PuiPassword.FeedbackColor.NONE, puiPassword2.getPanelColor());

        puiPassword2.type("J");
        assertEquals(PuiPassword.FeedbackColor.RED, puiPassword2.getPanelColor());

        puiPassword2.type("Junit12");
        assertEquals(PuiPassword.FeedbackColor.ORANGE, puiPassword2.getPanelColor());

        puiPassword2.type("Junit12$%&");
        assertEquals(PuiPassword.FeedbackColor.GREEN, puiPassword2.getPanelColor());

    }

    @Test
    @RunAsClient
    public void testUseCase3() {
        showPage();

        assertTrue(puiPassword3.isAngularJSInvalid());
        assertFalse(puiPassword3.isAngularJSValid());

        puiPassword3.type("t");

        assertFalse(puiPassword3.isAngularJSInvalid());
        assertTrue(puiPassword3.isAngularJSValid());
    }

    @Test
    @RunAsClient
    public void testUseCase4() {
        showPage();

        assertFalse(puiPassword4.isDisabled());

        disableButton.click();

        assertTrue(puiPassword4.isDisabled());
        puiPassword4.click();
        assertFalse(puiPassword4.isPanelVisible());

        enableButton.click();

        assertFalse(puiPassword4.isDisabled());
        puiPassword4.click();
        assertTrue(puiPassword4.isPanelVisible());

    }

    @Test
    @RunAsClient
    public void testUseCase5() {
        showPage();

        assertTrue(puiPassword5.isVisible());

        hideButton.click();

        assertFalse(puiPassword5.isVisible());

        showButton.click();
        assertTrue(puiPassword5.isVisible());
        puiPassword5.click();
        assertTrue(puiPassword5.isPanelVisible());
    }

}