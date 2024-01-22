import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('UserService', () => {
  let userService: UserService, 
      httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        UserService,
        
      ],
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
  it("Should retrieve all users",()=>{
    
    userService.getUsers().subscribe((users:any) =>{
      expect(users).toBeTruthy();
      expect(users.length).toBe(4)
    });
    
    // const req = HttpTestingController.expectOne('http://localhost:3000/user')
  })
});
