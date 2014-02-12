package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;
import org.jboss.arquillian.graphene.fragment.Root;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class WidgetSelection extends AbstractWidget {

    public int getWidgetCount() {
        return root.findElements(By.className("widgetSelection")).size();
    }

    public String getWidgetName(int idx) {
        List<WebElement> widgets = root.findElements(By.className("widgetSelection"));
        return widgets.get(idx).getText();

    }

    public void selectWidget(int idx) {
        List<WebElement> widgets = root.findElements(By.className("widgetSelection"));
        widgets.get(idx).click();
        waitUntilVisibilityOf(By.id("widgetSubPages"));
    }
}
