package be.rubus.angularprime.widget;

public class PuiButton extends AbstractWidget {

    public boolean isWidget() {
        return containsClassName(root, PUI_WIDGET);
    }

    public void click() {
        root.click();
    }
}
