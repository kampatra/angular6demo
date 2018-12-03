import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormArray, FormControl, FormControlName } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  validationMessages = {
    'fullName': {
      'required': 'Full Name i srequired.',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters'
    },
    'phone': {
      'required': 'Phone is required'
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Email Domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMismatch': 'Eamil and Confirm Eamil do not match'
    },
    // 'skillName': {
    //   'required': 'Skill Name is required'
    // }
    // ,
    // 'experienceInYears': {
    //   'required': 'Experience is required'
    // }
    // ,
    // 'proficiency': {
    //   'required': 'Proficiency is required'
    // }
  };

  formErrors = {
    'fullName': '',
    'phone': '',
    'email': '',
    // 'confirmEmail': '',
    // 'emailGroup': '',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };

  ngOnInit() {
    /* this.employeeForm = new FormGroup( {
       fullName: new FormControl(),
       email: new FormControl(),
       skills: new FormGroup({
         skillName: new FormControl(),
         experienceInYears: new FormControl(),
         proficiency: new FormControl()
       })
     });*/

    this.employeeForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this._fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['', [Validators.required]]
      }, { validator: CustomValidators.matchEmails }),
      phone: [''],
      skills: this._fb.array([
        this.addSkillFormGroup()    // this will add form group dynamically
      ])
      /** as above is added to add form group in array dynamically so bellow code is committed
      skills: this._fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required], //experienceInYears: ['20', Validators.required],
        proficiency: ['', Validators.required]  //proficiency: ['intermediate', Validators.required]
      })  */
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefernceChange(data);
    })
  }

  /*  Log the key value pair 
  logKeyValuePairs(group: FormGroup): void {
     Object.keys(group.controls).forEach((key: string) => {
       const abstractControl = group.get(key);
       if(abstractControl instanceof FormGroup) {
         this.logKeyValuePairs(abstractControl);
       } else {
         //console.log('key: ' + key + '   value: ' + abstractControl.value); // print key value
        // abstractControl.disable();  // disable the control
         abstractControl.markAsDirty(); // mark as dirty
       }
     }); */

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        //console.log(abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      // We need this additional check to get to the FormGroup
      // in the FormArray and then recursively call this
      // logValidationErrors() method to fix the broken validation
      // we have implmemented index in array, so bellow is not required so commenting
     /* if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      } */
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get("skills")).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillIndex: number):void {
    (<FormArray> this.employeeForm.get('skills')).removeAt(skillIndex);
  }

  onContactPrefernceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get("phone");
    const emailControl = this.employeeForm.get("email");
    console.log(selectedValue);
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
    } else {
      phoneControl.clearValidators();
      emailControl.setValidators(Validators.required);

    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }

  onSubmit(): void {
    console.log(this.employeeForm);
  }

  onLoadDataClick(): void {
    // setValue - you must have to provide all data
    /*this.employeeForm.setValue({
      fullName: 'Kamal Lochan Patra',
      email: 'jobs.kamalpatra@gmail.com',
      skills: {
        skillName: 'Spring Boot',
        experienceInYears: 5,
        proficiency: 'beginner'
      }
    }); */

    // used for partial value
    /*  this.employeeForm.patchValue({
        fullName: 'Kamal Lochan Patra',
        email: 'jobs.kamalpatra@gmail.com',
        skills: {
          skillName: 'Spring Boot'
        }
      });
      */

    //this.logKeyValuePairs(this.employeeForm);
    //this.logValidationErrors(this.employeeForm);
    //console.log(this.formErrors);

    /* ******** Testing of Form Array/Group/Cpontrol
      const formArray = new FormArray([
        new FormControl('John', Validators.required),
        new FormGroup({
          country: new FormControl('', Validators.required)
        }),
        new FormArray([])
      ]);
    
      console.log(formArray.length);
    
      for(const control of formArray.controls) {
        if(control instanceof FormControl) {
          console.log('Control is Form Control');
        }
        if(control instanceof FormGroup) {
          console.log('Control is FormGroup');
        }
        if(control instanceof FormArray) {
          console.log('Control is Form FormArray');
        }
      } 
      ************ End of Testing Form conrol/array/gorup */

    /** Testing of nested group */
    const formArray1 = this._fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ]);

    const formGroup = this._fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ]);
    console.log(formArray1);
    console.log(formGroup);

    formArray1.push(new FormControl("Mark", Validators.required));
    console.log(formArray1.at(3).value);
  }

  addSkillFormGroup(): FormGroup {
    return this._fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }


}
