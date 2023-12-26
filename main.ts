// src/app/todo.ts
import inquirer from 'inquirer';
import dayjs from 'dayjs';

interface Task {
    description: string;
    done: boolean;
    dueDate?: string;
    category?: string;
}

const tasks: Task[] = [];

export async function startTodoApp() {
    console.log('Welcome to the Enhanced ToDo App!');

    while (true) {
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Choose an option:',
            choices: ['View Tasks', 'Add Task', 'Mark as Done', 'Delete Task', 'Filter Tasks', 'Exit']
        });

        if (choice === 'Exit') {
            console.log('Thank you for using the ToDo App. Goodbye!');
            process.exit(0);
        }

        switch (choice) {
            case 'View Tasks':
                viewTasks();
                break;
            case 'Add Task':
                await addTask();
                break;
            case 'Mark as Done':
                await markAsDone();
                break;
            case 'Delete Task':
                await deleteTask();
                break;
            case 'Filter Tasks':
                await filterTasks();
                break;
        }
    }
}

function viewTasks() {
    console.log('\n--- ToDo List ---');
    tasks.forEach((task, index) => {
        const status = task.done ? '✔' : '◻';
        const dueDate = task.dueDate ? `(Due: ${task.dueDate})` : '';
        const category = task.category ? `(Category: ${task.category})` : '';
        console.log(`${index + 1}. [${status}] ${task.description} ${dueDate} ${category}`);
    });
    console.log('-----------------\n');
}

async function addTask() {
    const { description, dueDate, category } = await inquirer.prompt([
        {
            type: 'input',
            name: 'description',
            message: 'Enter the task description:'
        },
        {
            type: 'input',
            name: 'dueDate',
            message: 'Enter the due date (optional, YYYY-MM-DD):',
            validate: (input) => !input || dayjs(input, { strict: true }).isValid()
        },
        {
            type: 'input',
            name: 'category',
            message: 'Enter the category (optional):'
        }
    ]);

    tasks.push({ description, done: false, dueDate, category });
    console.log('Task added successfully!\n');
}

async function markAsDone() {
    const { index } = await inquirer.prompt({
        type: 'input',
        name: 'index',
        message: 'Enter the task index to mark as done:',
        validate: (input) => !isNaN(input) && input > 0 && input <= tasks.length || 'Please enter a valid index.'
    });

    tasks[index - 1].done = true;
    console.log('Task marked as done!\n');
}

async function deleteTask() {
    const { index } = await inquirer.prompt({
        type: 'input',
        name: 'index',
        message: 'Enter the task index to delete:',
        validate: (input) => !isNaN(input) && input > 0 && input <= tasks.length || 'Please enter a valid index.'
    });

    tasks.splice(index - 1, 1);
    console.log('Task deleted!\n');
}

async function filterTasks() {
    const { filterChoice } = await inquirer.prompt({
        type: 'list',
        name: 'filterChoice',
        message: 'Choose a filter option:',
        choices: ['Show All', 'Show Completed', 'Show Incomplete', 'Show Overdue', 'Show by Category']
    });

    switch (filterChoice) {
        case 'Show All':
            viewTasks();
            break;
        case 'Show Completed':
            viewFilteredTasks(true);
            break;
        case 'Show Incomplete':
            viewFilteredTasks(false);
            break;
        case 'Show Overdue':
            viewOverdueTasks();
            break;
        case 'Show by Category':
            await filterByCategory();
            break;
    }
}

function viewFilteredTasks(completed: boolean) {
    const filteredTasks = tasks.filter((task) => task.done === completed);
    console.log(`\n--- ${completed ? 'Completed' : 'Incomplete'} Tasks ---`);
    filteredTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description}`);
    });
    console.log('---------------------------\n');
}

function viewOverdueTasks() {
    const today = dayjs().format('YYYY-MM-DD');
    const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < today && !task.done);
    console.log('\n--- Overdue Tasks ---');
    overdueTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description} (Due: ${task.dueDate})`);
    });
    console.log('----------------------\n');
}

async function filterByCategory() {
    const categories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean)));
    const { selectedCategory } = await inquirer.prompt({
        type: 'list',
        name: 'selectedCategory',
        message: 'Choose a category:',
        choices: categories
    });

    const categoryTasks = tasks.filter((task) => task.category === selectedCategory);
    console.log(`\n--- Tasks in Category: ${selectedCategory} ---`);
    categoryTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description}`);
    });
    console.log('---------------------------\n');
}

// Start the enhanced ToDo application
startTodoApp();
