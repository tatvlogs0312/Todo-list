// Thêm công việc
// Sửa công việc - tiêu đề & trạng thái
// Xóa công việc
// Lọc công việc theo trạng thái

const API_URL = "http://localhost:8080/api/v1";
let todos = [];

function getTodosAPI(status) {
  switch (status) {
    case "all": {
      return axios.get(`${API_URL}/todos`);
    }
    case "unactive": {
      return axios.get(`${API_URL}/todos?status=false`);
    }
    case "active": {
      return axios.get(`${API_URL}/todos?status=true`);
    }
    default: {
      return axios.get(`${API_URL}/todos`);
    }
  }
}

async function getTodos(status) {
  try {
    let res = await getTodosAPI(status);
    todos = res.data;

    renderTodos(res.data);
  } catch (error) {
    console.log(error);
  }
}

// Truy cập vào các thành phần
const todoListEl = document.querySelector(".todo-list");

function renderTodos(arr) {
  // Xóa hết nội dung đang có
  todoListEl.innerHTML = "";

  // Kiểm tra mảng có rỗng hay không
  if (arr.length == 0) {
    todoListEl.innerHTML = "Không có công việc nào trong danh sách";
    return;
  }

  // Sử dụng vòng lặp để render
  let html = "";
  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];
    html += `
            <div class="todo-item ${t.status ? "active-todo" : ""}">
                <div class="todo-item-title">
                    <input 
                        type="checkbox" 
                        ${t.status ? "checked" : ""} 
                        onclick="toggleStatus(${t.id})"/>
                    <p>${t.title}</p>
                </div>
                <div class="option">
                    <button class="btn btn-update">
                        <img src="./img/pencil.svg" alt="icon" />
                    </button>
                    <button class="btn btn-delete" onclick="deleteTodo(${
                      t.id
                    })">
                        <img src="./img/remove.svg" alt="icon" />
                    </button>
                </div>
            </div>
        `;
  }
  todoListEl.innerHTML = html;
}

const todo_option_item = document.querySelectorAll(".todo-option-item input");

// Lấy giá trị trong 1 ô input radio
function getOptionSelected() {
  for (let i = 0; i < todo_option_item.length; i++) {
    if (todo_option_item[i].checked) {
      return todo_option_item[i].value;
    }
  }
}

// Lắng nghe sự thay đổi của từng input radio, nếu xảy ra sự thay đổi nào về mặt lựa chọn thì gọi API để lấy dữ liệu và hiển thị lại
todo_option_item.forEach((btn) => {
  btn.addEventListener("change", function () {
    let optionSelected = getOptionSelected();
    getTodos(optionSelected);
  });
});

// Xóa công việc
async function deleteTodo(id) {
  try {
    // Gọi API xóa
    await axios.delete(`${API_URL}/todos/${id}`);

    // Xóa ở mảng ban đầu
    todos.forEach((todo, index) => {
      if (todo.id == id) {
        todos.splice(index, 1);
      }
    });

    // Sau khi xóa thì render lại giao diện
    renderTodos(todos);
  } catch (error) {
    console.log(error);
  }
}

const inputTodoEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");

btnAdd.addEventListener("click", async function () {
  try {
    // Lấy title
    let title = inputTodoEl.value;

    // Kiểm tra tiêu đề có trống hay không
    if (title == "") {
      alert("Tiều đề không được để trống");
      return;
    }

    // Gọi API
    let res = await axios.post(`${API_URL}/todos`, {
      title: title,
    });

    // Thêm todo mới vào trong mảng todos ban đầu
    todos.push(res.data);

    // Hiển thị lại trên giao diện
    renderTodos(todos);
  } catch (error) {
    console.log(error);
  }
});

// Thay đổi trạng thái công việc
async function toggleStatus(id) {
  try {
    // Lấy ra công việc cần cập nhật
    let todo = todos.find((todo) => todo.id == id);

    // Gọi API
    let res = await axios.put(`${API_URL}/todos/${id}`, {
      title: todo.title,
      status: !todo.status,
    });

    if (res.data) {
      // Cập nhật lại todo trong mảng ban đầu
      todos.forEach((todo) => {
        if (todo.id == id) {
          todo.status = !todo.status;
        }
      });

      // Render lại trên giao diện
      renderTodos(todos);
    }
  } catch (error) {
    console.log(error);
  }
}

getTodos();
