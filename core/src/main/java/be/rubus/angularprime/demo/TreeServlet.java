package be.rubus.angularprime.demo;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TreeServlet extends HttpServlet {
    private TreeNode root;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        String id = request.getPathInfo().substring(1);
        TreeNode node = findNode(root, id);

        StringBuilder json = new StringBuilder();
        json.append('[');
        for (TreeNode child : node.getChildren()) {
            if (json.length() > 1) {
                json.append(',');
            }
            json.append(child.toString());
        }
        json.append(']');

        response.getOutputStream().print(json.toString());
    }

    private TreeNode findNode(TreeNode root, String someId) {
        TreeNode result = null;
        if (someId.equals(root.getId())) {
            result = root;
        }
        if (result == null) {
            for (TreeNode child : root.getChildren()) {
                result = findNode(child, someId);
                if (result != null) {
                    break;
                }
            }
        }
        return result;
    }

    @Override
    public void init() throws ServletException {
        super.init();
        root = new TreeNode("root", null, null);
        TreeNode documents = new TreeNode("documents", "Documents", null);
        root.addNode(documents);

        TreeNode work = new TreeNode("work", "Work", null);
        documents.addNode(work);

        work.addNode(new TreeNode("expenses", "Expenses.doc", "doc"));
        work.addNode(new TreeNode("resume", "Resume.doc", "doc"));

        TreeNode home = new TreeNode("home", "Home", null);
        documents.addNode(home);

        home.addNode(new TreeNode("invoices", "Invoices.doc", "doc"));

        TreeNode pictures = new TreeNode("pictures", "Pictures", null);
        root.addNode(pictures);

        pictures.addNode(new TreeNode("barcelona", "barcelona.jpg", "picture"));
        pictures.addNode(new TreeNode("logo", "logo.jpg", "picture"));
        pictures.addNode(new TreeNode("primeui", "primeui.png", "picture"));

        TreeNode movies = new TreeNode("movies", "Movies", null);
        root.addNode(movies);

        TreeNode pacino = new TreeNode("pacino", "Al Pacino", null);
        movies.addNode(pacino);

        pacino.addNode(new TreeNode("scarface", "Scarface", "movie"));
        pacino.addNode(new TreeNode("serpico", "Serpico", "movie"));

        TreeNode deNiro = new TreeNode("deNiro", "Robert De Niro", null);
        movies.addNode(deNiro);

        deNiro.addNode(new TreeNode("goodfellas", "Goodfellas", "movie"));
        deNiro.addNode(new TreeNode("untouchables", "Untouchables", "movie"));
    }

}
