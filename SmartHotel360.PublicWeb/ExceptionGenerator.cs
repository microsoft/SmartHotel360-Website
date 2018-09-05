using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb
{
    public class ExceptionGenerator
    {
        public static int GenerateException()
        {
            var zero = 0;
            var nonzero = 4;

            var wrongCalculation = nonzero / zero;

            return wrongCalculation;
        }
    }
}
