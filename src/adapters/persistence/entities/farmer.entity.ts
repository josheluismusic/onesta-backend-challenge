import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'farmers',
})
export class FarmerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;
}
