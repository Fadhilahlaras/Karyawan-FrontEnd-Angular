import {Component, OnInit} from '@angular/core';
import {Employee} from './employee';
import {EmployeeService} from './employee.service';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;
  public formData: Employee[];
  Positions: {};
  title: Employee;

  constructor(private employeeService: EmployeeService, private http: HttpClient) {
  }

  private apiServerUrl = environment.apiBaseUrl;

  ddlPosition = '';

  ngOnInit() {
    this.getEmployees();
    this.getPositionList();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getPositionList(): void {
    this.http.get(`${this.apiServerUrl}/position`).subscribe(
      data => this.Positions = data
    );
  }

  public onAddEmloyee(addForm: NgForm): void {
    console.log(addForm.value);
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmloyee(editForm: NgForm): void {
    console.log(editForm.value);
    document.getElementById('edit-employee-form').click();
    this.employeeService.updateEmployee(editForm.value).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmloyee(employeeId: number, employee: Employee): void {
    this.employeeService.deleteEmployee(employeeId, employee).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.birthDate.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.positionName.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }


}
