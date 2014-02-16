package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

public class PuiPassword extends AbstractWidget {

    private WebElement passwordPanel;

    public boolean isWidget() {
        return containsClassName(root, PUI_WIDGET);
    }

    public boolean hasPasswordPanel() {
        if (passwordPanel == null) {
            WebElement candidate = getNextSibling(root);
            if (containsClassName(candidate, "pui-password-panel")) {
                passwordPanel = candidate;
            }
        }
        return passwordPanel != null;
    }

    public boolean isPanelVisible() {
        getPasswordPanel();
        return passwordPanel.isDisplayed();
    }

    private void getPasswordPanel() {
        if (passwordPanel == null) {
            hasPasswordPanel();
        }
        if (passwordPanel == null) {
              throw new NoSuchElementException("Panel not available");
        }
    }

    public boolean isPanelPopupType() {
        getPasswordPanel();
        return containsClassName(passwordPanel, "pui-password-panel-overlay");
    }

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

    public void click() {
        root.click();
    }

    public boolean isVisible() {
        return root.isDisplayed();
    }

    public String getValue() {
        return root.getAttribute("value");
    }

    public void blur() {
        blur(root);
    }

    public String getPanelText() {
        getPasswordPanel();
        return passwordPanel.findElement(By.className("pui-password-info")).getText();
    }

    public FeedbackColor getPanelColor() {
        getPasswordPanel();
        WebElement colorElement = passwordPanel.findElement(By.className("pui-password-meter"));
        String[] values = getComputedCssValue(colorElement, "background-position").split(" ");
        // TODO check if we have the correct number of items in the array
        return FeedbackColor.getInstance(values[1]);
    }

    public boolean isAngularJSInvalid() {
        return containsClassName(root, NG_INVALID);
    }

    public boolean isAngularJSValid() {
        return containsClassName(root, NG_VALID);
    }

    public static enum FeedbackColor {
        NONE("0px"), RED("-10px"), ORANGE("-20px"), GREEN("-30px");

        private String position;

        FeedbackColor(String somePosition) {
            position = somePosition;
        }

        static FeedbackColor getInstance(String currentPosition) {
            FeedbackColor result = null;
            for (FeedbackColor item : FeedbackColor.values()) {
                if (item.position.equals(currentPosition)) {
                    result = item;
                }
            }
            return result;
        }
    }
}
