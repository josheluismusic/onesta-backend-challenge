import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FruitEntity } from './fruit.entity';

@Entity({
    name: 'fruit_varieties',
})
export class VarietyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => FruitEntity, (fruit) => fruit.varieties)
    fruit: FruitEntity;

    @Column({ unique: true })
    uniqueKey: string;
}
