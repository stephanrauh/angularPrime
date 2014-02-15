package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;
import org.openqa.selenium.Alert;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.fail;

public class BrowserWindow extends AbstractWidget {

    private Alert alert;

    @Override
    public boolean isWidget() {
        throw new IllegalStateException("not implemented");
    }

    public boolean doesBrowserSupportNumericInputTypes() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        return (Boolean) js.executeScript("return Modernizr.inputtypes.number");

    }

    public boolean doesBrowserSupportColorInputTypes() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        return (Boolean) js.executeScript("return Modernizr.inputtypes.color");

    }

    public void checkForAlert() {
        WebDriverWait wait = new WebDriverWait(driver, 5);
        if (wait.until(ExpectedConditions.alertIsPresent()) == null) {

            fail("Alert not showing as feedback for user");
        }
    }

    public String getAlertText() {
        alert = driver.switchTo().alert();
        return alert.getText();

    }

    public void alertAccept() {
        alert.accept();
    }

    public void checkForNoAlert() {
        WebDriverWait wait = new WebDriverWait(driver, 5);
        try {
            wait.until(ExpectedConditions.alertIsPresent());
            fail("Alert is showing and not expected to popup");
        } catch (TimeoutException te) {

            ; // OK we don't want to see the alert
        }

    }
}
