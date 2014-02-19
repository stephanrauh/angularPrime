package be.rubus.angularprime.widget;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PuiCheckbox extends AbstractWidget {

    @FindBy(xpath = "../..")
    private WebElement container;

    public boolean isWidget() {
        return !root.isDisplayed() && containsClassName(container, PUI_WIDGET);
    }

    public boolean hasHoverClassWhenHovered() {
        WebElement box = getCheckboxBox();
        boolean noHover = containsClassName(box, PUI_HOVER);
        moveTo(root);
        boolean hover = containsClassName(box, PUI_HOVER);
        return !noHover && hover;
    }

    public void click() {
        getCheckboxBox().click();
    }

    public boolean isChecked() {
        WebElement icon = container.findElement(By.className("pui-chkbox-icon"));
        return containsClassName(icon, "ui-icon-check");
    }

    private WebElement getCheckboxBox() {
        return container.findElement(By.className("pui-chkbox-box"));
    }

    public boolean isDisabled() {
        return containsClassName(getCheckboxBox(), PUI_DISABLED);
    }

    public boolean isVisible() {
        return container.isDisplayed();
    }
}
