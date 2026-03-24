import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: Repository<Employee>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
