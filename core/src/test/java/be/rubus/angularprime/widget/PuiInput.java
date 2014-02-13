package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;
import org.openqa.selenium.Keys;

public class PuiInput extends AbstractWidget {

    public void type(String value) {
        root.clear();
        root.sendKeys(value);
    }

    public boolean hasHoverClassWhenHovered() {
        boolean noHover = containsClassName(root, PUI_HOVER);
        moveTo(root);
        boolean hover = containsClassName(root, PUI_HOVER);
        return !noHover && hover;
    }

    public boolean isDisabled() {
        return containsClassName(root, PUI_DISABLED);
    }

    public boolean isAngularJSInvalid() {
        return containsClassName(root, NG_INVALID);
    }

    public boolean isAngularJSValid() {
        return containsClassName(root, NG_VALID);
    }

    public void sendUpArrowFromKeyboard() {
        root.sendKeys(Keys.ARROW_UP);

    }
    public void sendDownArrowFromKeyboard() {
        root.sendKeys(Keys.ARROW_DOWN);
    }

    public void click() {
        root.click();
    }

    public boolean isVisible() {
        return root.isDisplayed();
    }
}
