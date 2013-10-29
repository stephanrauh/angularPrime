package be.rubus.angularprime.demo;

import java.util.ArrayList;
import java.util.List;

public class TreeNode {

    private String id;
    private String label;
    private String iconType;
    private List<TreeNode> children;

    public TreeNode(String someId, String someLabel, String someIconType) {
        id = someId;
        label = someLabel;
        iconType = someIconType;
        children = new ArrayList<TreeNode>();
    }

    public void addNode(TreeNode child) {
        children.add(child);
    }

    public List<TreeNode> getChildren() {
        return children;
    }

    public String getId() {
        return id;
    }

    public String toString() {
        StringBuilder result = new StringBuilder();
        result.append("{\"label\":\"").append(label).append("\",");
        result.append("\"data\":\"").append(id).append("\",");
        result.append("\"iconType\":\"").append(iconType).append("\",");
        result.append("\"leaf\":").append(children.size()==0).append("}");

        return result.toString();
    }
}
