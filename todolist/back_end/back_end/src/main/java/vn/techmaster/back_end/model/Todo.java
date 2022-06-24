package vn.techmaster.back_end.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Todo {
    private int id;
    private String title;
    private boolean status;
}
