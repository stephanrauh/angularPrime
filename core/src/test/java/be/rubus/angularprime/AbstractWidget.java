package be.rubus.angularprime;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.fragment.Root;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class AbstractWidget {

    protected static final String NG_INVALID = "ng-invalid";
    protected static final String NG_VALID = "ng-valid";
    protected static final String PUI_WIDGET = "ui-widget";
    protected static final String PUI_HOVER = "ui-state-hover";
    protected static final String PUI_DISABLED = "ui-state-disabled";

    @Drone
    protected WebDriver driver;

    @Root
    protected WebElement root;

    public abstract boolean isWidget();

    protected boolean containsClassName(WebElement element, String className) {
        return element.getAttribute("class").contains(className);
    }

    protected void waitUntilVisibilityOf(By byClause) {

        new WebDriverWait(driver, 5).until(ExpectedConditions.presenceOfElementLocated(byClause));

        WebElement checkElement = driver.findElement(byClause);

        new WebDriverWait(driver, 5).until(ExpectedConditions.visibilityOf(checkElement));

    }

    protected void waitUntilVisibilityOf(WebElement element) {

        new WebDriverWait(driver, 5).until(ExpectedConditions.visibilityOf(element));

    }

    protected void waitForAjax() {
        boolean ajaxIsComplete;
        int loopCount = 50;
        while (loopCount > 0) {
            ajaxIsComplete = (Boolean) ((JavascriptExecutor) driver).executeScript("return jQuery.active == 0");
            if (ajaxIsComplete) {
                break;
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
            loopCount--;

        }
        if (loopCount == 0) {
            throw new RuntimeException("Ajax request still running after timeout");
        }
    }

    protected void moveTo(WebElement element) {
        Actions builder = new Actions(driver);
        builder.moveToElement(element).build().perform();
    }

    protected WebElement getParent(WebElement element) {
        return element.findElement(By.xpath(".."));
    }


    public String getAttribute(String attributeName) {
        return root.getAttribute(attributeName);
    }
}
