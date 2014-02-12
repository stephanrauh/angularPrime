package be.rubus.angularprime.demo.usecases;

import be.rubus.angularprime.demo.Deployed;
import be.rubus.angularprime.widget.PuiInput;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.Filters;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;

import java.net.URL;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(Arquillian.class)
public class InputTest  {

    @Drone
    private WebDriver driver;

    @FindBy(id="case1")
    private PuiInput puiInput;

    @Test
    @RunAsClient
    public void testUseCase1() {
        driver.get(Deployed.ROOT+"usecases/pui-input/input.html");

        assertTrue(puiInput.isAngularJSInvalid());
        assertFalse(puiInput.isAngularJSValid());

        puiInput.type("test");

        assertFalse(puiInput.isAngularJSInvalid());
        assertTrue(puiInput.isAngularJSValid());
    }
}

