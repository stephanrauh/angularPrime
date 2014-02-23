package be.rubus.angularprime.demo.widgets;

import be.rubus.angularprime.widget.PuiButton;
import be.rubus.angularprime.widget.PuiTextarea;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

@RunWith(Arquillian.class)
public class TextAreaTest extends AbstractWidgetTest {

    @FindBy(id = "modelValue")
    private WebElement modelValue;

    @FindBy(id = "basic")
    private PuiTextarea puiTextareaBasic;

    // Disable/enable demo
    @FindBy(id = "disabled")
    private PuiTextarea puiTextareaDisabled;

    @FindBy(id = "enableBtn")
    private PuiButton enableButton;

    @FindBy(id = "disableBtn")
    private PuiButton disableButton;

    // resize demo
    @FindBy(id = "resize")
    private PuiTextarea puiTextareaResize;

    // remaining
    @FindBy(id = "remaining")
    private PuiTextarea puiTextareaRemaining;

    @FindBy(id = "display")
    private WebElement labelRemainingCharacters;

    // word autocomplete
    @FindBy(id = "complete")
    private PuiTextarea puiTextareaComplete;


    @Override
    protected int getWidgetIdx() {
        return 27;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("textarea", "puiInput on <textarea >", 6);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);

        assertEquals("Default integration", contentArea.getExampleName());

        assertTrue(puiTextareaBasic.isWidget());
        assertFalse(puiTextareaBasic.isDisabled());
        assertFalse(puiTextareaBasic.hasAutoComplete());

        assertTrue(puiTextareaBasic.hasHoverClassWhenHovered());

        assertEquals("Change me", modelValue.getText());
        puiTextareaBasic.type("JUnit");
        assertEquals("JUnit", modelValue.getText());

    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(2);

        assertEquals("Integration with ng-disabled", contentArea.getExampleName());

        assertTrue(puiTextareaDisabled.isWidget());
        assertTrue(puiTextareaDisabled.isDisabled());

        // To be really sure it is disabled
        assertEquals("Change me", modelValue.getText());
        try {
            puiTextareaDisabled.type("JUnit");
            fail("Element isn't disabled");
        } catch (InvalidElementStateException e) {
            ; // expected behaviour
        }

        enableButton.click();

        assertFalse(puiTextareaDisabled.isDisabled());
        assertEquals("Change me", modelValue.getText());
        puiTextareaDisabled.type("JUnit");
        assertEquals("JUnit", modelValue.getText());

        disableButton.click();
        assertTrue(puiTextareaDisabled.isDisabled());
        try {
            puiTextareaDisabled.type("XX");
            fail("Element isn't disabled");
        } catch (InvalidElementStateException e) {
            ; // expected behaviour
        }

    }

    @Test
    @RunAsClient
    public void testResize() {
        showExample(3);

        assertEquals("Autoresizable", contentArea.getExampleName());

        assertTrue(puiTextareaResize.isWidget());
        String height = puiTextareaResize.getHeight();

        puiTextareaResize.type("Multiple line\nenough lines to make widget scale\nAnother line\n" + "Another line\n"
                + "Another line\n" + "Another line");
        assertNotEquals(height, puiTextareaResize.getHeight());
    }

    @Test
    @RunAsClient
    public void testCharactersRemaining() {
        showExample(4);

        assertEquals("Maximum number of characters and indication number remaining", contentArea.getExampleName());

        assertTrue(puiTextareaRemaining.isWidget());
        assertEquals("Change me", puiTextareaRemaining.getValue());
        assertEquals("11 chars remaining.", labelRemainingCharacters.getText());

        puiTextareaRemaining.type("JUnit");
        assertEquals("15 chars remaining.", labelRemainingCharacters.getText());

        puiTextareaRemaining.type("And you are not allowed to type more then 20 characters");
        assertEquals("0 chars remaining.", labelRemainingCharacters.getText());
        assertEquals("And you are not allo", puiTextareaRemaining.getValue());

    }

    @Test
    @RunAsClient
    public void testAutoComplete() {
        showExample(5);

        assertEquals("Word autocompletion", contentArea.getExampleName());

        assertTrue(puiTextareaComplete.isWidget());
        assertTrue(puiTextareaComplete.hasAutoComplete());

        puiTextareaComplete.type("This is a test");
        puiTextareaComplete.waitForPopupPanel();

        List<String> items = puiTextareaComplete.getAutocompleteSuggestions();
        assertEquals(5, items.size());
        assertEquals("test2", items.get(2));

        puiTextareaComplete.selectSuggestion(3);
        assertEquals("This is a test3", puiTextareaComplete.getValue());

        assertFalse(puiTextareaComplete.isSuggestionPanelVisible());
    }

}
