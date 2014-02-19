package be.rubus.angularprime.widget;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.fail;

public class PuiRadiobutton extends AbstractWidget {

    @FindBy(xpath = "../..")
    private WebElement container;

    @FindBy(xpath = "../../..")
    private WebElement directive;

    @Override
    public boolean isWidget() {
        return containsClassName(root, PUI_WIDGET);
    }

    public boolean hasHoverClassWhenHovered() {
        WebElement box = getRadiobuttonBox();
        boolean noHover = containsClassName(box, PUI_HOVER);
        moveTo(container);
        boolean hover = containsClassName(box, PUI_HOVER);
        return !noHover && hover;
    }


    private WebElement getRadiobuttonBox() {
        return container.findElement(By.className("pui-radiobutton-box"));
    }

    public void click() {
        container.click();
    }

    public boolean isSelected() {
        WebElement icon = container.findElement(By.className("pui-radiobutton-icon"));
        return containsClassName(icon, "ui-icon-bullet");
    }

    public String getValue() {
        return root.getAttribute(VALUE);
    }

    public boolean isDisabled() {
        return containsClassName(getRadiobuttonBox(), PUI_DISABLED);
    }

    public boolean isVisible() {
        if (!containsAttribute(directive, "pui-radiobutton")) {
            fail("Visibility check can only performed on directive form of widget");
        }
        return directive.isDisplayed();
    }
}
