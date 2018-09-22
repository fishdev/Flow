# Flow

[![Flow Movie](https://img.youtube.com/vi/7WHW9mlvEpU/0.jpg)](https://www.youtube.com/watch?v=7WHW9mlvEpU)

## Inspiration

Many of our family members live in water-scarce areas, such as California and India. Currently, the best water tracking solutions involve reading a meter on-site in remote areas, a task that's both tedious and time-consuming. We wanted to create a solution that solves this issue.

## What it does

Flow uses a turbine to measure water flow rate. This information is then relayed back to our computer, which sends uploads the statistics to our database. This can then be accessed from our Android/iOS app and website.

## How we built it

The hardware component is driven by an Arduino and the computer application is written in Processing. The backend is written Node.js using express.js with Redis on the database. Password.js is used for authentication. The mobile applications utilize Flutter to create both and Android and iOS app while maintaining a single code base.

## Challenges we ran into

The CMU network prohibits us from publicizing our IP addresses. As a result, we had to host the server locally. This made testing exponentially more difficult between computers.

## Accomplishments that we're proud of

The scalability of our project. All aspects of the project were designed with scalability in mind. Our backend is easily able to interact with thousands of devices while the actual hardware prototype is simple enough to be easily mass produced.

## What we learned

- How to write scalable backends
- How to create Android/iOS apps
- How to create websites
- How to integrate hardware and software
- Version control (git)
- Working with deadlines
- Working collaboratively on a major project

## What's next for Flow

We hope to further optimize our system to decrease latency and increase efficiency. We can increase functionality by supporting multiple Flow devices per account. Moreover, we can port over website functionality to the Android/iOS apps. Also, we can improve upon our AI so it can figure out when there are leaks in a water network and better predict future usage.