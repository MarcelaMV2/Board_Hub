import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { CreateLoanInput } from './dto/create-loan.input';
import { UpdateLoanInput } from './dto/update-loan.input';
import { LoanChangeStatus } from './args/loan-change-status.args';

@Resolver(() => Loan)
export class LoansResolver {
  constructor(private readonly loansService: LoansService) {}

  @Mutation(() => Loan)
  createLoan(@Args('createLoanInput') createLoanInput: CreateLoanInput) {
    return this.loansService.create(createLoanInput);
  }

  @Query(() => [Loan], { name: 'loans' })
  findAll() {
    return this.loansService.findAll();
  }

  @Query(() => Loan, { name: 'loan' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.loansService.findOne(id);
  }

  @Mutation(() => Loan)
  updateLoan(@Args('updateLoanInput') updateLoanInput: UpdateLoanInput) {
    return this.loansService.update(updateLoanInput.id, updateLoanInput);
  }

  @Mutation(() => Loan)
  removeLoan(@Args('id', { type: () => String }) id: string) {
    return this.loansService.remove(id);
  }

  @Mutation(() => Loan)
  changeStatus(@Args() args: LoanChangeStatus) {
    return this.loansService.changeStatus(args);
  }
}
