package be.rubus.angularprime.widget;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.enricher.ReflectionHelper;
import org.jboss.arquillian.graphene.enricher.exception.GrapheneTestEnricherException;
import org.jboss.arquillian.graphene.findby.FindByUtilities;
import org.jboss.arquillian.graphene.fragment.Root;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;

import static org.junit.Assert.assertFalse;

public abstract class AbstractWidget {

    protected static final String NEW_LINE = System.getProperty("line.separator");

    protected static final String NG_INVALID = "ng-invalid";
    protected static final String NG_VALID = "ng-valid";
    protected static final String NG_PRISTINE = "ng-pristine";
    protected static final String NG_DIRTY = "ng-dirty";
    protected static final String PUI_WIDGET = "ui-widget";
    protected static final String PUI_HOVER = "ui-state-hover";
    protected static final String PUI_DISABLED = "ui-state-disabled";

    protected static final String VALUE = "value";

    @Drone
    protected WebDriver driver;

    @Root
    protected WebElement root;

    public abstract boolean isWidget();

    protected void initializeManually(WebElement someRoot, AbstractWidget parentWidget) {
        root = someRoot;
        driver = parentWidget.driver;

        try {
            List<Field> fields = ReflectionHelper.getFieldsWithAnnotation(getClass(), FindBy.class);
            for (Field field : fields) {
                By by = FindByUtilities.getCorrectBy(field, How.ID_OR_NAME);
                // WebElement
                if (field.getType().isAssignableFrom(WebElement.class)) {

                    WebElement element = root.findElement(by);
                    setValue(field, this, element);
                    // List<WebElement>
                } else if (field.getType().isAssignableFrom(List.class) && getListType(field)
                        .isAssignableFrom(WebElement.class)) {
                    List<WebElement> elements = root.findElements(by);
                    setValue(field, this, elements);
                }

            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    private static void setValue(Field field, Object target, Object value) {

        boolean accessible = field.isAccessible();
        if (!accessible) {
            field.setAccessible(true);
        }
        try {
            field.set(target, value);
        } catch (Exception ex) {
            throw new GrapheneTestEnricherException("During enriching of " + NEW_LINE + target.getClass() + NEW_LINE
                    + " the field " + NEW_LINE + field + " was not able to be set! Check the cause!", ex);
        }
        if (!accessible) {
            field.setAccessible(false);
        }
    }

    private static Class<?> getListType(Field listField) throws ClassNotFoundException {
        return Class.forName(listField.getGenericType().toString().split("<")[1].split(">")[0].split("<")[0]);
    }

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

    protected WebElement getNextSibling(WebElement element) {
        String id = getId(element);
        assertFalse("getNextSibling() can only be called for Element with id", id.isEmpty());

        WebElement result = null;
        WebElement parent = getParent(element);
        List<WebElement> children = parent.findElements(By.xpath(".//*"));
        Iterator<WebElement> iterator = children.iterator();
        while (result == null && iterator.hasNext()) {
            WebElement child = iterator.next();
            if (getId(child).equals(id)) {
                if (iterator.hasNext()) {
                    result = iterator.next();
                }
            }
        }
        return result;

    }

    protected String getId(WebElement element) {
        return element.getAttribute("id");
    }

    protected void blur(WebElement someElement) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].blur();", someElement);

    }

    protected String getComputedCssValue(WebElement someElement, String cssName) {
        return someElement.getCssValue(cssName);
    }

    public String getAttribute(String attributeName) {
        return root.getAttribute(attributeName);
    }

    public String getAttribute(WebElement someElement, String attributeName) {
        return someElement.getAttribute(attributeName);
    }

    public boolean containsAttribute(WebElement someElement, String attributeName) {
        return getAttribute(someElement, attributeName) != null;
    }

}
