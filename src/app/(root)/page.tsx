import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {
   const loggedIn = { firstName: 'Steve', lastName: 'JSM', email: 'steveafrikenya1@gmail.com',  id: '1', userId: 'string;', dwollaCustomerUrl: 'string;', dwollaCustomerId: 'string;', city: 'string', state: 'string;', address1: 'string;', postalCode: 'string', dateOfBirth: 'string;', ssn: 'string;' };

    return (
        <section className="Home">
            <div className="home-content">
                <header className="home-header" style={{width:"70%"}}>
                    <HeaderBox
                    type="greeting"
                    title="Welcome"
                    user={loggedIn?.firstName || 'Guest'}
                    subtext="Access and manage yout account and transactions efficiently."
                    />

                    <TotalBalanceBox 
                      accounts={[]}
                      totalBanks={1}
                      totalCurrentBalance={1250.35}
                      
                    />
                </header>

              RECENT TRANSACTIONS  
            </div>

            <RightSidebar 
            user={loggedIn}
            transactions={[]}
            banks={[{ currentBalance: 123.50 }, {currentBalance: 500.50} ]}
            />
        </section>
    )
}

export default Home