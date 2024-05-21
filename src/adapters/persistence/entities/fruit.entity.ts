import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VarietyEntity } from './variety.entity';

@Entity({
    name: 'fruits',
})
export class FruitEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => VarietyEntity, (variety) => variety.fruit)
    varieties: VarietyEntity[];
}
