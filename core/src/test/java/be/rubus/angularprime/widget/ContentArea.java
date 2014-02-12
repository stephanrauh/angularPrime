package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;
import org.jboss.arquillian.graphene.fragment.Root;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ContentArea extends AbstractWidget {

    @FindBy(id = "widgetSubPages")
    private WebElement subpagesContainer;

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
    }

}
