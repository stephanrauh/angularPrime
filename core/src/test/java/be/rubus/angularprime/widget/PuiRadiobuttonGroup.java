package be.rubus.angularprime.widget;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.ArrayList;
import java.util.List;

public class PuiRadiobuttonGroup extends AbstractWidget {

    @FindBy(xpath = "../..")
    private WebElement container;

    private List<PuiRadiobutton> buttons;

    public boolean isWidget() {
        return !root.isDisplayed() && containsClassName(container, PUI_WIDGET);
    }

    public int getNumberOfButtons() {
        identifyButtons();
        return buttons.size();
    }

    private void identifyButtons() {
        if (buttons == null) {
            List<WebElement> elements = driver.findElements(By.name(root.getAttribute("name")));

            buttons = new ArrayList<PuiRadiobutton>();
            for (WebElement element : elements) {
                PuiRadiobutton radiobutton = new PuiRadiobutton();
                radiobutton.initializeManually(element, this);
                buttons.add(radiobutton);
            }
        }
    }

    public boolean hasHoverClassWhenHovered() {
        identifyButtons();
        boolean result = true;
        for (PuiRadiobutton button : buttons) {
            result = result && button.hasHoverClassWhenHovered();
        }
        return result;
    }

    public void clickButton(int idx) {
        identifyButtons();
        buttons.get(idx).click();
    }

    public String getSelectedValue() {
        identifyButtons();

        String result = null;
        for (PuiRadiobutton button : buttons) {
            if (button.isSelected()) {
                result = button.getValue();
            }
        }
        return result;
    }

    public boolean isButtonDisabled(int idx) {
        identifyButtons();
        return buttons.get(idx).isDisabled();
    }

    public boolean isButtonVisible(int idx) {
        identifyButtons();
        return buttons.get(idx).isVisible();

    }
}
