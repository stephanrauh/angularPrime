package be.rubus.angularprime.widget;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class ContentArea extends AbstractWidget {

    @FindBy(id = "widgetSubPages")
    private WebElement subpagesContainer;

    @FindBy(tagName = "header")
    private WebElement exampleHeader;

    public String getName() {
        WebElement panel = root.findElement(By.xpath("div"));
        return panel.findElements(By.className("pui-panel-titlebar")).get(0).getText();
    }

    public int getSubpagesCount() {
        return subpagesContainer.findElements(By.tagName("a")).size();
    }

    public void gotoExample(int idx) {
        subpagesContainer.findElements(By.tagName("a")).get(idx).click();
        waitForAjax();
        waitUntilVisibilityOf(exampleHeader);
    }

    public String getExampleName() {
        return exampleHeader.getText();
    }

    public String getNewInVersionNumber() {
        try {
            WebElement version = exampleHeader.findElement(By.tagName("span"));
            if (version != null) {
                return getAttribute(version, "version");
            }
        } catch (NoSuchElementException e) {
            ; // No span
        }
        return "";
    }

    @Override
    public boolean isWidget() {
        return false;
    }
}
