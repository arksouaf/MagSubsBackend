import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MagazineService } from './magazine.service';
import { Magazine } from './magazine.entity';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('MagazineService', () => {
  let service: MagazineService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'mysql8003.site4now.net',
      port: 3306,
      username: 'a92383_magsubs',
      password: 'abd123456',
      database: 'db_a92383_magsubs',
          entities: [Magazine,Subscription],
          synchronize: true,
        }), // Import TypeOrmModule without any configurations to use the default connection from ormconfig.json
        TypeOrmModule.forFeature([Magazine, Subscription]),
      ],
      providers: [MagazineService],
    }).compile();

    service = module.get<MagazineService>(MagazineService);
    connection = module.get<Connection>(Connection);
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await connection.query(`DELETE FROM subscription`);
    await connection.query(`DELETE FROM magazine`);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of magazines', async () => {
      // Insert test data into the database
      const magazine1 = await service.create({ name: 'Magazine 1', price: 10 });
      const magazine2 = await service.create({ name: 'Magazine 2', price: 15 });
  
      const result = await service.findAll();
  
      // Convert the price property to number for comparison
      const expectedMagazines = [
        { id: magazine1.id, name: 'Magazine 1', price: 10 },
        { id: magazine2.id, name: 'Magazine 2', price: 15 }
      ];
  
      // Convert the expected price to a string
      const expectedWithStrings = expectedMagazines.map(magazine => ({
        ...magazine,
        price: magazine.price.toFixed(2)
      }));
  
      expect(result).toHaveLength(expectedMagazines.length);
      expectedWithStrings.forEach(expected => {
        const received = result.find(magazine => magazine.id === expected.id);
        expect(received).toEqual(expected);
      });
    });
  });
  
  

  describe('findOne', () => {
    it('should return a magazine by id', async () => {
      // Insert test data into the database
      const magazine = await service.create({ name: 'Magazine', price: 10 });
      const result = await service.findOne(magazine.id);

      expect(result.name).toEqual(magazine.name);
    });
  });

  describe('create', () => {
    it('should create a new magazine', async () => {
      const magazineData: Partial<Magazine> = { name: 'New Magazine', price: 20 };

      const result = await service.create(magazineData);

      expect(result).toMatchObject(magazineData);
    });
  });

  describe('update', () => {
    it('should update a magazine by id', async () => {
      // Insert test data into the database
      const magazine = await service.create({ name: 'Magazine', price: 10 });

      const updatedData: Partial<Magazine> = {id:magazine.id, name: 'Updated Magazine', price: 15.00 };
      await service.update(magazine.id, updatedData);
      
      const updatedMagazine = await service.findOne(magazine.id);
      expect(updatedMagazine.name).toEqual(updatedData.name);
    });
  });

  describe('remove', () => {
    it('should remove a magazine by id', async () => {
      // Insert test data into the database
      const magazine = await service.create({ name: 'Magazine', price: 10 });

      await service.remove(magazine.id);

      const result = await service.findOne(magazine.id);
      expect(result).toBeNull();
    });
  });
  describe('subscribeToMagazine', () => {
    it('should create a new subscription', async () => {
      // Create a magazine for testing
      const magazine = await service.create({ name: 'Magazine 1', price: 10 });

      // Call subscribeToMagazine method
      const subscription = await service.subscribeToMagazine(1, magazine.id);

      // Ensure the subscription is created
      expect(subscription).toBeDefined();
      expect(subscription.userId).toEqual(1);
      expect(subscription.magazine.id).toEqual(magazine.id);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription for user', async () => {
      // Create a subscription for testing
      const magazine = await service.create({ name: 'Magazine 1', price: 10 });
      const subscription = await service.subscribeToMagazine(1, magazine.id);

      // Call cancelSubscription method
      await service.cancelSubscription(1, magazine.id);

      // Ensure the subscription is removed
      expect(await service.findOne(subscription.id)).toBeNull();
    });

    it('should throw NotFoundException if subscription not found', async () => {
      // Call cancelSubscription method with non-existent subscription
      await expect(service.cancelSubscription(1, 1)).rejects.toThrowError(NotFoundException);
    });
  });

});