package be.rubus.angularprime.widget;

import be.rubus.angularprime.AbstractWidget;

public class Label extends AbstractWidget {
    @Override
    public boolean isWidget() {
        return false;
    }

    public String getText() {
        return root.getText();
    }
}
