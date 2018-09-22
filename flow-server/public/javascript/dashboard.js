let user;
let flowData;

document.addEventListener('DOMContentLoaded', () => {
  axios.get('/api/my').then((res) => {
    user = res.data;
    if (user.flow) {
      axios.get('/api/myflow').then((fRes) => {
        flowData = fRes.data;
        document.querySelector('#flowid-text').innerHTML = user.flow;
        document.querySelector('#flowinfo').classList.remove('is-hidden');
        createChart();
        document.querySelector('#limitvalue').value = user.limit || 0;
        document.querySelector('#emailvalue').value = user.email;
      }).catch(() => {
        alert('Data unavailable');
      });
    } else {
      document.querySelector('#registerflow').classList.remove('is-hidden');
    }
  }).catch(() => {
    alert('Idk what went wrong');
  });
});

// eslint-disable-next-line no-unused-vars
function addFlow() {
  const flow = document.querySelector('#flowid').value;
  if (flow) {
    axios.post('/api/register', {
      id: flow,
    }).then(() => {
      window.location.reload();
    }).catch(() => {
      alert('Failed to register');
    });
  }
}

// eslint-disable-next-line no-unused-vars
function removeFlow() {
  if (confirm('Are you sure?')) {
    axios.post('/api/deregister').then(() => {
      window.location.reload();
    }).catch(() => {
      alert('You are stuck with your Flow');
    });
  }
}

// eslint-disable-next-line no-unused-vars
function set(prop) {
  const { value } = document.querySelector(`#${prop}value`);
  axios.post(`/api/set${prop}`, { value }).then(() => {}).catch(() => {
    alert('Could not save changes');
    window.location.reload();
  });
}

function createChart() {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Water Consumption',
          data: flowData.collected_data,
          fill: false,
          borderColor: '#2B60FF',
        },
        {
          label: 'Smart AI Prediction',
          data: flowData.smart_ai,
          fill: false,
          borderColor: '#23d160',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            format: 'x',
            tooltipFormat: 'DD/MM/YYYY HH:mm:ss',
          },
          scaleLabel: {
            display: true,
            labelString: 'Date/Time',
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Liters/second',
          },
        }],
      },
    },
  };

  const ctx = document.getElementById('flow-chart').getContext('2d');
  new Chart(ctx, config);
}
